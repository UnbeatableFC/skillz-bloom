import ProfileSection from "./ProfileSection";


const SettingsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Section */}
      <ProfileSection/>

      {/* Preferences Section */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Preferences</h2>
        <p>Preferences form will go here</p>
      </div>

      {/* Learning Preferences */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Learning Preferences</h2>
        <p>Learning preferences form will go here</p>
      </div>

      {/* Account & Security */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Account & Security</h2>
        <p>Logout / Delete account buttons will go here</p>
      </div>
    </div>
  );
};

export default SettingsPage;
