import React, { useState } from 'react';

const SkillIconRenderer = ({ skillIcon, skillName }) => {
  const [hasError, setHasError] = useState(false);

  // If there's an error or skillIcon is falsy (empty, null, undefined), show fallback
  if (hasError || !skillIcon) {
    return (
      <span className="text-muted" style={{ fontStyle: "italic", color: "red" }}>
        No Icon Available
      </span>
    );
  }

  // Check if it's a URL (http/https or relative path)
  if (skillIcon.startsWith("http") || skillIcon.startsWith("/")) {
    return (
      <img
        src={skillIcon}
        alt={`${skillName} icon`}
        style={{ width: "24px", height: "24px" }} // Adjust size as needed
        onError={() => setHasError(true)} // Set error state if image fails to load
      />
    );
  } else {
    // Assume it's an icon class (e.g., "fas fa-react")
    return <i className={skillIcon} style={{ fontSize: "1.5rem" }} title={`${skillName} icon`}></i>;
  }
};

export default SkillIconRenderer;
