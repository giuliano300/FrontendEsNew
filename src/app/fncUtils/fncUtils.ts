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

      
    static GetFormattedData(d: string): string{
      const data = new Date(d);
        const dataFormattata = data.toLocaleString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Rome',
        });

        return dataFormattata;
      }

  }

