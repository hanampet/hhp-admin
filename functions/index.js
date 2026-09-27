const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

admin.initializeApp();
const client = new SecretManagerServiceClient();

// 1. Secret 가져오기 함수
exports.getSecretValue = functions.region('asia-northeast3').https.onCall(async (data, context) => {
  // 관리자 권한 확인 (로그인 여부)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }

  const secretName = data.secretName;
  const project = process.env.GCLOUD_PROJECT;

  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/${project}/secrets/${secretName}/versions/latest`,
    });
    const payload = version.payload.data.toString();
    return { value: payload };
  } catch (error) {
    console.error('Secret Access Error:', error);
    // 시크릿이 없거나 권한이 없는 경우 빈 값 반환
    return { value: '' };
  }
});

// 2. Secret 설정/업데이트 함수
exports.updateSecretValue = functions.region('asia-northeast3').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }

  const { secretName, secretValue } = data;
  const project = process.env.GCLOUD_PROJECT;
  const parent = `projects/${project}/secrets/${secretName}`;

  try {
    // 시크릿에 새 버전 추가
    await client.addSecretVersion({
      parent: parent,
      payload: { data: Buffer.from(secretValue, 'utf8') },
    });
    return { success: true };
  } catch (error) {
    console.error('Update Secret Error:', error);

    // 만약 시크릿 자체가 존재하지 않는다면 생성 시도 로직이 필요할 수 있습니다.
    // 여기서는 기존 시크릿이 있다는 가정하에 버전을 추가합니다.
    throw new functions.https.HttpsError('internal', error.message);
  }
});
