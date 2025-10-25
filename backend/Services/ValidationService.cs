using System.Text.RegularExpressions;

namespace NestFin.API.Services
{
    public class ValidationService
    {
        /// <summary>
        /// Valida se o email é real e válido
        /// </summary>
        public static (bool IsValid, string ErrorMessage) ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return (false, "Email é obrigatório");

            // Regex para validação de email mais rigorosa
            var emailRegex = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
            
            if (!emailRegex.IsMatch(email))
                return (false, "Formato de email inválido");

            // Verifica se não é um email temporário/descartável
            var disposableDomains = new[]
            {
                "10minutemail.com", "tempmail.org", "guerrillamail.com", 
                "mailinator.com", "yopmail.com", "temp-mail.org",
                "throwaway.email", "getnada.com", "maildrop.cc"
            };

            var domain = email.Split('@')[1].ToLower();
            if (disposableDomains.Contains(domain))
                return (false, "Emails temporários não são permitidos");

            // Verifica se o domínio existe (validação básica)
            if (!IsValidDomain(domain))
                return (false, "Domínio do email não é válido");

            return (true, string.Empty);
        }

        /// <summary>
        /// Valida se a senha é forte
        /// </summary>
        public static (bool IsValid, string ErrorMessage) ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (false, "Senha é obrigatória");

            if (password.Length < 8)
                return (false, "Senha deve ter pelo menos 8 caracteres");

            if (password.Length > 128)
                return (false, "Senha deve ter no máximo 128 caracteres");

            // Verifica se contém pelo menos uma letra minúscula
            if (!password.Any(char.IsLower))
                return (false, "Senha deve conter pelo menos uma letra minúscula");

            // Verifica se contém pelo menos uma letra maiúscula
            if (!password.Any(char.IsUpper))
                return (false, "Senha deve conter pelo menos uma letra maiúscula");

            // Verifica se contém pelo menos um número
            if (!password.Any(char.IsDigit))
                return (false, "Senha deve conter pelo menos um número");

            // Verifica se contém pelo menos um caractere especial
            var specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
            if (!password.Any(c => specialChars.Contains(c)))
                return (false, "Senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)");

            // Verifica senhas comuns/fracas
            var commonPasswords = new[]
            {
                "password", "123456", "123456789", "qwerty", "abc123",
                "password123", "admin", "letmein", "welcome", "monkey",
                "1234567890", "password1", "qwerty123", "dragon", "master"
            };

            if (commonPasswords.Contains(password.ToLower()))
                return (false, "Esta senha é muito comum. Escolha uma senha mais segura");

            // Verifica padrões sequenciais
            if (HasSequentialChars(password))
                return (false, "Senha não pode conter sequências como '123' ou 'abc'");

            return (true, string.Empty);
        }

        /// <summary>
        /// Valida se o nome é válido
        /// </summary>
        public static (bool IsValid, string ErrorMessage) ValidateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return (false, "Nome é obrigatório");

            if (name.Length < 2)
                return (false, "Nome deve ter pelo menos 2 caracteres");

            if (name.Length > 100)
                return (false, "Nome deve ter no máximo 100 caracteres");

            // Verifica se contém apenas letras, espaços e alguns caracteres especiais
            var nameRegex = new Regex(@"^[a-zA-ZÀ-ÿ\s'-]+$");
            if (!nameRegex.IsMatch(name))
                return (false, "Nome deve conter apenas letras, espaços, hífens e apóstrofos");

            return (true, string.Empty);
        }

        /// <summary>
        /// Verifica se o domínio do email é válido
        /// </summary>
        private static bool IsValidDomain(string domain)
        {
            // Lista de domínios válidos conhecidos
            var validDomains = new[]
            {
                "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
                "live.com", "msn.com", "icloud.com", "me.com",
                "protonmail.com", "yandex.com", "mail.ru", "aol.com",
                "zoho.com", "fastmail.com", "tutanota.com", "gmx.com"
            };

            // Se for um domínio conhecido, é válido
            if (validDomains.Contains(domain))
                return true;

            // Para outros domínios, verifica se tem formato válido
            var domainRegex = new Regex(@"^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$");
            return domainRegex.IsMatch(domain);
        }

        /// <summary>
        /// Verifica se a senha contém caracteres sequenciais
        /// </summary>
        private static bool HasSequentialChars(string password)
        {
            var lowerPassword = password.ToLower();
            
            // Verifica sequências numéricas
            for (int i = 0; i < lowerPassword.Length - 2; i++)
            {
                if (char.IsDigit(lowerPassword[i]) && 
                    char.IsDigit(lowerPassword[i + 1]) && 
                    char.IsDigit(lowerPassword[i + 2]))
                {
                    var num1 = lowerPassword[i] - '0';
                    var num2 = lowerPassword[i + 1] - '0';
                    var num3 = lowerPassword[i + 2] - '0';
                    
                    if ((num2 == num1 + 1 && num3 == num2 + 1) || 
                        (num2 == num1 - 1 && num3 == num2 - 1))
                        return true;
                }
            }

            // Verifica sequências alfabéticas
            for (int i = 0; i < lowerPassword.Length - 2; i++)
            {
                if (char.IsLetter(lowerPassword[i]) && 
                    char.IsLetter(lowerPassword[i + 1]) && 
                    char.IsLetter(lowerPassword[i + 2]))
                {
                    var char1 = lowerPassword[i] - 'a';
                    var char2 = lowerPassword[i + 1] - 'a';
                    var char3 = lowerPassword[i + 2] - 'a';
                    
                    if ((char2 == char1 + 1 && char3 == char2 + 1) || 
                        (char2 == char1 - 1 && char3 == char2 - 1))
                        return true;
                }
            }

            return false;
        }
    }
}
