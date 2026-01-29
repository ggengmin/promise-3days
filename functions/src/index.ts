import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Scheduled function that runs every hour to check for promises
 * that need notifications sent
 */
export const checkAndSendNotifications = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    try {
      // Get all pending promises where notification date has passed
      const snapshot = await db
        .collection('promises')
        .where('status', '==', 'pending')
        .where('notificationDate', '<=', now)
        .get();

      if (snapshot.empty) {
        console.log('No promises to notify');
        return null;
      }

      const promises = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Send notifications for each promise
      for (const promise of promises) {
        const { fcmTokens, content, creatorName, id } = promise;

        if (fcmTokens && fcmTokens.length > 0) {
          const message = {
            notification: {
              title: '너, 약속 지켰어? 🤨',
              body: `${creatorName}의 약속 시간이에요! "${content}" 지켰는지 확인하세요!`,
            },
            data: {
              promiseId: id,
              type: 'promise_reminder',
            },
            tokens: fcmTokens,
          };

          try {
            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`Sent ${response.successCount} notifications for promise ${id}`);

            // Update promise status
            await db.collection('promises').doc(id).update({
              status: 'notified',
            });
          } catch (error) {
            console.error(`Error sending notifications for promise ${id}:`, error);
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error in checkAndSendNotifications:', error);
      return null;
    }
  });

/**
 * Scheduled function that runs daily to clean up old public promises
 * (older than 24 hours)
 */
export const cleanupOldPromises = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    const cutoffTime = admin.firestore.Timestamp.fromDate(oneDayAgo);

    try {
      const snapshot = await db
        .collection('promises')
        .where('isPublic', '==', true)
        .where('createdAt', '<=', cutoffTime)
        .get();

      if (snapshot.empty) {
        console.log('No old promises to delete');
        return null;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Deleted ${snapshot.size} old public promises`);

      return null;
    } catch (error) {
      console.error('Error in cleanupOldPromises:', error);
      return null;
    }
  });

/**
 * HTTP function to manually trigger notification check (for testing)
 */
export const triggerNotificationCheck = functions.https.onRequest(async (req, res) => {
  try {
    await checkAndSendNotifications.run({} as any);
    res.json({ success: true, message: 'Notification check triggered' });
  } catch (error) {
    console.error('Error triggering notification check:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});
