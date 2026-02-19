function ProfilePrivacyControls({
  profilePrivate,
  setPublic,
  setPrivate
}) {
  return (
    <div>
      <strong>
        Public: {profilePrivate ? "False" : "True"}
      </strong>

      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={setPublic}>
          Make profile public
        </button>

        <button onClick={setPrivate} style={{ marginLeft: "0.5rem" }}>
          Make profile private
        </button>
      </div>
    </div>
  );
}

export default ProfilePrivacyControls;
