function SideBar() {
  console.log("SideBar rendered");
  return (
    <div className="drawer z-10">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label
          htmlFor="sidebar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => console.log("Sidebar closed")}
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li>
            <a href="#item1">Sidebar Item 1</a>
          </li>
          <li>
            <a href="#item2">Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
