import ProfileSection from "./ProfileSection";
import PreferencesSection from "./PreferencesSection";
import LearningPreferences from "./LearningPreferences";
import AccountSecurity from "./AccountSecurity";

const SettingsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Section */}
      <ProfileSection/>

      {/* Preferences Section */}
      <PreferencesSection/>

      {/* Learning Preferences */}
      <LearningPreferences/>

      {/* Account & Security */}
       <AccountSecurity/>
    </div>
  );
};

export default SettingsPage;
