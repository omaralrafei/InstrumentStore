const crypto = require("crypto");
const key = "oiguliehiuvc&*$*653574s796098472";

const encrypt = (password)=> {
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), iv );
    const encryptedPass = Buffer.concat([
        cipher.update(password), 
        cipher.final(),
    ]);

    return { iv: iv.toString("hex"), password: encryptedPass.toString("hex") };
};
const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv("aes-256-ctr", Buffer.from(key), Buffer.from(encryption.iv, "hex"));
    const decryptedPass = Buffer.concat([decipher.update(Buffer.from(encryption.password, "hex")), decipher.final()]);
    return decryptedPass.toString();
};
module.exports = {encrypt, decrypt};