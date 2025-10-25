// Serviço de validação para email e senha no frontend
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export class ValidationService {
  /**
   * Valida se o email é real e válido
   */
  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim() === '') {
      return { isValid: false, errorMessage: 'Email é obrigatório' };
    }

    // Regex para validação de email mais rigorosa
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, errorMessage: 'Formato de email inválido' };
    }

    // Verifica se não é um email temporário/descartável
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'temp-mail.org',
      'throwaway.email', 'getnada.com', 'maildrop.cc',
      'tempail.com', 'sharklasers.com', 'guerrillamailblock.com'
    ];

    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      return { isValid: false, errorMessage: 'Emails temporários não são permitidos' };
    }

    return { isValid: true, errorMessage: '' };
  }

  /**
   * Valida se a senha é forte
   */
  static validatePassword(password: string): ValidationResult {
    if (!password || password.trim() === '') {
      return { isValid: false, errorMessage: 'Senha é obrigatória' };
    }

    if (password.length < 8) {
      return { isValid: false, errorMessage: 'Senha deve ter pelo menos 8 caracteres' };
    }

    if (password.length > 128) {
      return { isValid: false, errorMessage: 'Senha deve ter no máximo 128 caracteres' };
    }

    // Verifica se contém pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      return { isValid: false, errorMessage: 'Senha deve conter pelo menos uma letra minúscula' };
    }

    // Verifica se contém pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, errorMessage: 'Senha deve conter pelo menos uma letra maiúscula' };
    }

    // Verifica se contém pelo menos um número
    if (!/\d/.test(password)) {
      return { isValid: false, errorMessage: 'Senha deve conter pelo menos um número' };
    }

    // Verifica se contém pelo menos um caractere especial
    const specialChars = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/;
    if (!specialChars.test(password)) {
      return { isValid: false, errorMessage: 'Senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)' };
    }

    // Verifica senhas comuns/fracas
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      '1234567890', 'password1', 'qwerty123', 'dragon', 'master',
      'senha', '12345678', 'password123', 'admin123', 'root'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      return { isValid: false, errorMessage: 'Esta senha é muito comum. Escolha uma senha mais segura' };
    }

    // Verifica padrões sequenciais
    if (this.hasSequentialChars(password)) {
      return { isValid: false, errorMessage: 'Senha não pode conter sequências como "123" ou "abc"' };
    }

    return { isValid: true, errorMessage: '' };
  }

  /**
   * Valida se o nome é válido
   */
  static validateName(name: string): ValidationResult {
    if (!name || name.trim() === '') {
      return { isValid: false, errorMessage: 'Nome é obrigatório' };
    }

    if (name.trim().length < 2) {
      return { isValid: false, errorMessage: 'Nome deve ter pelo menos 2 caracteres' };
    }

    if (name.length > 100) {
      return { isValid: false, errorMessage: 'Nome deve ter no máximo 100 caracteres' };
    }

    // Verifica se contém apenas letras, espaços e alguns caracteres especiais
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, errorMessage: 'Nome deve conter apenas letras, espaços, hífens e apóstrofos' };
    }

    return { isValid: true, errorMessage: '' };
  }

  /**
   * Verifica se a senha contém caracteres sequenciais
   */
  private static hasSequentialChars(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    
    // Verifica sequências numéricas
    for (let i = 0; i < lowerPassword.length - 2; i++) {
      if (/\d/.test(lowerPassword[i]) && /\d/.test(lowerPassword[i + 1]) && /\d/.test(lowerPassword[i + 2])) {
        const num1 = parseInt(lowerPassword[i]);
        const num2 = parseInt(lowerPassword[i + 1]);
        const num3 = parseInt(lowerPassword[i + 2]);
        
        if ((num2 === num1 + 1 && num3 === num2 + 1) || 
            (num2 === num1 - 1 && num3 === num2 - 1)) {
          return true;
        }
      }
    }

    // Verifica sequências alfabéticas
    for (let i = 0; i < lowerPassword.length - 2; i++) {
      if (/[a-z]/.test(lowerPassword[i]) && /[a-z]/.test(lowerPassword[i + 1]) && /[a-z]/.test(lowerPassword[i + 2])) {
        const char1 = lowerPassword[i].charCodeAt(0) - 'a'.charCodeAt(0);
        const char2 = lowerPassword[i + 1].charCodeAt(0) - 'a'.charCodeAt(0);
        const char3 = lowerPassword[i + 2].charCodeAt(0) - 'a'.charCodeAt(0);
        
        if ((char2 === char1 + 1 && char3 === char2 + 1) || 
            (char2 === char1 - 1 && char3 === char2 - 1)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Valida todos os campos de registro
   */
  static validateRegistration(name: string, email: string, password: string): ValidationResult {
    const nameValidation = this.validateName(name);
    if (!nameValidation.isValid) return nameValidation;

    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) return emailValidation;

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) return passwordValidation;

    return { isValid: true, errorMessage: '' };
  }
}
