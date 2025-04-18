export class FncUtils {
    static checkPasswordStrength(password: string): 'debole' | 'media' | 'forte' {
      const lengthScore = password.length >= 12 ? 2 : password.length >= 8 ? 1 : 0;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);
  
      const varietyScore = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  
      const totalScore = lengthScore + varietyScore;
  
      if (totalScore <= 2) return 'debole';
      if (totalScore === 3 || totalScore === 4) return 'media';
      return 'forte';
    }
  }
  