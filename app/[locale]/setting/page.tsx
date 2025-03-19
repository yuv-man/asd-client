import './setting.sass'
import ClientSettingsContent from './ClientSettingsContent';

const SettingsPage = ({ params }: { params: { locale: string } }) => {
  return <ClientSettingsContent />;
};

export default SettingsPage;
