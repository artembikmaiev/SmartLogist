export default function DriverHeader() {
  return (
    <header style={{padding: '16px', borderBottom: '1px solid #ededed', display: 'flex', alignItems: 'center'}}>
      <span style={{fontWeight: 'bold', marginRight: '32px'}}>SmartLogist</span>
      <nav>
        <a href="/driver/trips" style={{marginRight: '16px'}}>Мої рейси</a>
        <a href="/driver/profile" style={{marginRight: '16px'}}>Профіль</a>
      </nav>
      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
        <span style={{background:'#2563eb', color:'white', padding:'8px 12px', borderRadius:'50%', marginRight:8}}>ВД</span>
        <span style={{fontWeight:'bold'}}>Водій</span>
      </div>
    </header>
  );
}

