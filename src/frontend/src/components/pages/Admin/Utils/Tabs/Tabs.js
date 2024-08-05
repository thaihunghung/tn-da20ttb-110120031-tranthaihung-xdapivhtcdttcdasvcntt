const Tabs = ({ tabs, activeTab, setActiveTab }) => {

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="h-fit">
      <table className="mb-2">
        <tr className="tab-buttons border-collapse border">
          {tabs.map((tab, index) => (
            <td>
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`${index === activeTab ? 'active ' : ''} ${index === activeTab ? 'bg-gray-800 text-white ' : ''} border p-2 px-7`}
              >
                {tab.title}
              </button>
            </td>
          ))}
        </tr>
      </table>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

export default Tabs;

