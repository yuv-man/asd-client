import './setting.scss'
import ClientSettingsContent from './ClientSettingsContent';

const SettingsPage = ({ params }: { params: { locale: string } }) => {
  return <ClientSettingsContent />;
};

export default SettingsPage;
