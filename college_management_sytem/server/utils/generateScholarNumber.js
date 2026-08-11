
const crypto = require("crypto");

const MAX_ATTEMPTS = 10;


const generateRandomSuffix = () => {
 
  const randomNumber = crypto.randomInt(0, 100000000); // 0 - 99,999,999
  return randomNumber.toString().padStart(8, "0");
};

/**
 * Generates a unique 10-digit Scholar Number.
 * Requires the Mongoose User model to check uniqueness against the DB.
 *
 * @param {import("mongoose").Model} UserModel - the User mongoose model
 * @returns {Promise<string>} a unique 10-digit scholar number
 */
const generateScholarNumber = async (UserModel) => {
  const yearPrefix = new Date().getFullYear().toString().slice(-2); // "24"

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = `${yearPrefix}${generateRandomSuffix()}`; // 10 digits

    // eslint-disable-next-line no-await-in-loop
    const existingStudent = await UserModel.findOne({
      scholarNumber: candidate,
    }).lean();

    if (!existingStudent) {
      return candidate;
    }
  }


  throw new Error(
    "Failed to generate a unique scholar number after multiple attempts. Please try again."
  );
};

module.exports = generateScholarNumber;
