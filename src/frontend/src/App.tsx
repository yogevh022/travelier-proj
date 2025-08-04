import React, { createContext, useRef, useState } from 'react';
import './main_styles.css';
import { DealTable } from './components/deal_table';
import { useQuery } from '@tanstack/react-query';
import _ from "lodash";
import { DealEditor, DealEditorHandle } from './components/deal_editor';
import { DealType } from '../../types/dealType';

export type DealEditorContext = {
    openDealEditor: (deal?: DealType) => void,
    closeDealEditor: () => void,
    refetch: () => void,
}

export const dealEditorContext = createContext<DealEditorContext | undefined>(undefined);

function App() {
    const [nameSearch, setNameSearch] = useState("");
    // currentDeal is the deal currently being edited (or none)
    const [currentDeal, setCurrentDeal] = useState<DealType | undefined>(undefined);
    const [dealEditorOpen, setDealEditorOpen] = useState(false);
    const dealEditorHandle = useRef<DealEditorHandle>(null);

    const openDealEditor = (deal?: DealType) => {
        if (deal) {
            setCurrentDeal(deal);
            dealEditorHandle.current?.fillFields(deal);
        }
        setDealEditorOpen(true);
    }

    const closeDealEditor = () => {
        setDealEditorOpen(false);
        setCurrentDeal(undefined);
        dealEditorHandle.current?.clearFields();
    }

    const debouncedNameSearch = React.useMemo(
        () => _.debounce((value: string) => setNameSearch(value), 300), []);

    const { data: dealData, refetch } = useQuery({
        initialData: [],
        queryKey: ['deals', nameSearch],
        queryFn: async () => {
            const response = nameSearch !== "" ?
                await fetch(`/api/deals?name=${nameSearch}`)
                : await fetch('/api/deals');

            if (!response.ok) {
                throw new Error('err');
            }
            return response.json();
        },
    });

    return (
        <dealEditorContext.Provider value={{ openDealEditor, closeDealEditor, refetch }}>
            <div className="page_container">
                <DealEditor
                    ref={dealEditorHandle}
                    edit={currentDeal}
                    open={dealEditorOpen}
                />
                <div
                    className={`darkscreen ${dealEditorOpen ? "active" : ""}`}
                    onClick={() => closeDealEditor()}
                >
                </div >

                <input onChange={(e) => debouncedNameSearch(e.target.value)}/>
                <DealTable deals={dealData}/>
                <button
                    onClick={() => openDealEditor()}
                >
                    CREATE DEAL
                </button>
            </div>
        </dealEditorContext.Provider>
    );
}

export default App;
