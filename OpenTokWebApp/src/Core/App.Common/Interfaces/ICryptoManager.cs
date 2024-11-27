namespace App.Common.Interfaces
{
    public interface ICryptoManager
    {
        /// <summary>
        /// Encrypts the plain text and returns the encrypted text.
        /// </summary>
        /// <param name="plainText"></param>
        /// <returns></returns>
        string EncryptText(string plainText);

        /// <summary>
        /// Decrypts the cipher text and returns the plain text.
        /// </summary>
        /// <param name="cipherText"></param>
        /// <returns></returns>
        string DecryptText(string cipherText);
    }
}
