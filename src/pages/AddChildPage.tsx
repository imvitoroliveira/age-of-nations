import { useNavigate } from 'react-router-dom';
import { AddChildScreen } from '@/components/screens/AddChildScreen';

const AddChildPage = () => {
  const navigate = useNavigate();
  return <AddChildScreen onBack={() => navigate('/')} onDone={() => navigate('/categories')} />;
};

export default AddChildPage;
