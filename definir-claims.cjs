const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function main() {
    const uid = process.argv[2];
    const papel = process.argv[3];

    if (!uid) throw new Error("Passe o UID. Ex: node definir-claims.cjs <UID> administrador");
    if (!papel) throw new Error("Passe o papel. Ex: node definir-claims.cjs <UID> administrador");

    await admin.auth().setCustomUserClaims(uid, { papel });

    const user = await admin.auth().getUser(uid);
    console.log(`✅ Claim definida: uid=${uid}`);
    console.log("Claims atuais:", user.customClaims);
}

main().catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
});
