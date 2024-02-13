import { Provider } from "react-redux";
import { AppRouter } from "./router/AppRouter.jsx"
import { BrowserRouter } from 'react-router-dom';
import { store } from "./store/index.js";


export const CalendarApp = () => {
  return (
    <Provider store = {store}>
      <BrowserRouter>
            <AppRouter />
      </BrowserRouter>
    </Provider>

    
  )
}
