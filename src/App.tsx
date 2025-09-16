import './App.css'
import Banner from './components/Banner'
import SelectionPanel from './components/SelectionPanel'
function App() {
  return (
    <>
      <Banner />
      <div className="max-w-[1280px] mx-auto mt-[80px]">
      <SelectionPanel />
      </div>
    </>
  );
}


export default App
