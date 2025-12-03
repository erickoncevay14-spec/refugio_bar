import React from 'react';
import './BartenderTopBar.css';

const BartenderTopBar = ({ title, userName, actions }) => {
  return (
    <div className="bartender-topbar">
      <div className="bartender-topbar-header">
        <h1 className="bartender-topbar-title">{title}</h1>
        <span className="bartender-topbar-user">{userName}</span>
      </div>
      <div className="bartender-topbar-actions">
        {actions && actions.map((action, index) => (
          <button
            key={index}
            className="bartender-topbar-action-button"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BartenderTopBar;