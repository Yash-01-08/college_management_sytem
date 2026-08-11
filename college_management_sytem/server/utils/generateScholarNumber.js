/**
 * Scholar Number format (10 digits total):
 *
 *   [ YY ][ RRRRRRRR ]
 *    2      8
 *
 * - YY: last two digits of the current year (e.g. "24" for 2024).
 *   This makes the batch/year of a student visible at a glance,
 *   similar to how many Indian colleges format enrollment numbers.
 * - RRRRRRRR: 8 cryptographically-random digits, zero-padded.
 *
 * Example: 2412011344
 *          "24" -> registered in 2024
 *          "12011344" -> random unique sequence
 *
 * Uniqueness is NOT guaranteed by the format alone (two students in
 * the same year could theoretically get the same random suffix), so
 * every generated number is checked against the database before use.
 * If a collision is found, a new number is generated and checked again.
 * The scholarNumber field also has a `unique: true` index in the User
 * model as a hard database-level safety net against race conditions.
 */

const crypto = require("crypto");

const MAX_ATTEMPTS = 10;

/**
 * Generates a random 8-digit numeric string (zero-padded).
 */
const generateRandomSuffix = () => {
  // crypto.randomInt is cryptographically stronger than Math.random
  // and avoids modulo bias issues.
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

  // Extremely unlikely with 8 random digits (100M possibilities/year),
  // but fail loudly instead of silently returning a duplicate.
  throw new Error(
    "Failed to generate a unique scholar number after multiple attempts. Please try again."
  );
};

module.exports = generateScholarNumber;
