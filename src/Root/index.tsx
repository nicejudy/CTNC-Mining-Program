import { HashRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import App from "./App";

function Root() {
    const app = () => (
        <HashRouter>
            <QueryParamProvider>
                <App />
            </QueryParamProvider>
        </HashRouter>
    );

    return app();
}

export default Root;
