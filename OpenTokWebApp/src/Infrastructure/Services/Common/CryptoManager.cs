using App.Common.Interfaces;
using App.Common.Models;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Services.Common
{
    internal sealed class CryptoManager : ICryptoManager
    {
        private readonly byte[] _secretKey;
        private readonly byte[] _initializationVector;

        public CryptoManager(CryptoOptions cryptoOptions)
        {
            _secretKey = Encoding.UTF8.GetBytes(cryptoOptions.SecretKey);
            _initializationVector = Encoding.UTF8.GetBytes(cryptoOptions.InitializationVector);
        }

        public string DecryptText(string cipherText)
        {
            byte[] buffer = Convert.FromBase64String(cipherText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = _secretKey;
                aes.IV = _initializationVector;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (var memoryStream = new MemoryStream(buffer))
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (var streamReader = new StreamReader(cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

        public string EncryptText(string plainText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = _secretKey;
                aes.IV = _initializationVector;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (var streamWriter = new StreamWriter(cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }
                    }

                    return Convert.ToBase64String(memoryStream.ToArray());
                }
            }
        }
    }
}
