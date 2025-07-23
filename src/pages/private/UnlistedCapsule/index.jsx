import React from "react";
import { useUnlistedLogic } from ".";
import "./styles.css";

const UnlistedCapsule = () => {
  const { token, setToken, isSubmitting, handleSubmit } = useUnlistedLogic();

  return (
    <div className="unlisted-container">
      <div className="unlisted-header">
        <h1>Access Unlisted Capsule</h1>
      </div>

      <div className="unlisted-content">
        <form onSubmit={handleSubmit} className="unlisted-form">
          <div className="form-group">
            <label htmlFor="token">Enter Capsule Token</label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Paste your capsule token here"
              required
              autoFocus
            />
            <p className="form-hint">
              This token was shared with you by the capsule creator
            </p>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !token.trim()}
          >
            {isSubmitting ? "Accessing..." : "View Capsule"}
          </button>
        </form>

        <div className="unlisted-info">
          <h3>What is an unlisted capsule?</h3>
          <p>
            Unlisted capsules are private time capsules that can only be
            accessed with a special token. They won't appear in public listings
            or search results.
          </p>
          <p>
            If you've received a token from someone, paste it above to view
            their capsule.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnlistedCapsule;
