export default function ManagerHeader() {
  return (
    <header style={{padding: '16px', borderBottom: '1px solid #ededed', display: 'flex', alignItems: 'center'}}>
      <span style={{fontWeight: 'bold', marginRight: '32px'}}>SmartLogist</span>
      <nav>
        <a href="/manager/trips" style={{marginRight: '16px'}}>Рейси</a>
        <a href="/manager/drivers" style={{marginRight: '16px'}}>Водії</a>
        <a href="/manager/vehicles" style={{marginRight: '16px'}}>Транспорт</a>
        <a href="/manager/analytics" style={{marginRight: '16px'}}>Аналітика</a>
      </nav>
      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
        <span style={{background:'#2563eb', color:'white', padding:'8px 12px', borderRadius:'50%', marginRight:8}}>МЛ</span>
        <span style={{fontWeight:'bold'}}>Менеджер Логістики</span>
        <span style={{fontSize:12, color:'#aaa', marginLeft:8}}>manager@smartlogist.ua</span>
      </div>
    </header>
  );
}

