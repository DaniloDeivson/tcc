import { useState } from 'react';
import { personalService, PersonalInfoDto } from '@/lib/api';

export const usePersonalInfo = () => {
  const [info, setInfo] = useState<PersonalInfoDto>({});
  const [goalName, setGoalName] = useState('');
  const [goalValue, setGoalValue] = useState<number | ''>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setFeedback(null);
    
    try {
      await personalService.upsertInfo(info);
      
      if (goalName && goalValue !== '' && Number(goalValue) > 0) {
        await personalService.createGoal({ 
          name: goalName, 
          targetAmount: Number(goalValue) 
        });
        setGoalName('');
        setGoalValue('');
      }
      
      setFeedback('Dados salvos com sucesso');
    } catch {
      setFeedback('Erro ao salvar');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    info,
    setInfo,
    goalName,
    setGoalName,
    goalValue,
    setGoalValue,
    feedback,
    isLoading,
    handleSave,
  };
};
