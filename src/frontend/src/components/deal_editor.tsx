import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { DealType, NewDealType } from '../../../types/dealType';
import { dealEditorContext } from '../App';

const are_dates_valid = (startDate?: Date, endDate?: Date): boolean => {
    if (!startDate|| !endDate) {
        return false;
    }
    return startDate <= endDate;
}

type DealEditorProps = {
    edit?: DealType,
    open: boolean,
}

export interface DealEditorHandle {
    clearFields: () => void;
    fillFields: (deal: DealType) => void;
}

export const DealEditor = forwardRef<DealEditorHandle, DealEditorProps>((props, ref) => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [dealName, setDealName] = useState("");
    const [client, setClient] = useState("client1");
    const [status, setStatus] = useState("draft");
    const dealEditorHandle = useContext(dealEditorContext);

    const clearFields = () => {
        setStartDate(new Date());
        setEndDate(new Date());
        setDealName("");
        setClient("client1");
        setStatus("draft");
    }

    const fillFields = (deal: DealType) => {
        console.log(new Date(deal.end_date));
        setClient(deal.client);
        setDealName(deal.name);
        setStatus(deal.status);
        setEndDate(new Date(deal.end_date));
        setStartDate(new Date(deal.start_date));
    }

    useImperativeHandle(ref, () => ({
        clearFields,
        fillFields
    }));

    const post = (new_deal: NewDealType) => {
        fetch('api/deals', {
            method: 'POST',
            body: JSON.stringify(new_deal),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                dealEditorHandle?.refetch();
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const put = (deal: DealType) => {
        fetch('api/deals', {
            method: 'PUT',
            body: JSON.stringify(deal),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                dealEditorHandle?.refetch();
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!are_dates_valid(startDate, endDate)) {
            alert("end date must be after start date");
            return;
        }

        const data: NewDealType = {
            client,
            name: dealName,
            status: status as DealType["status"],
            start_date: startDate!.toDateString(),
            end_date: endDate!.toDateString(),
        };
        if (props.edit) {
            put({...data, _id: props.edit._id});
        } else {
            post(data);
        }
        dealEditorHandle?.closeDealEditor();
    }

    return (
        <form onSubmit={handleSubmit} className={`deal-editor ${props.open ? "open" : ""}`}>
            <select>
                <option value="client1">Client 1</option>
                <option value="client2">Client 2</option>
                <option value="client3">Client 3</option>
                <option value="client4">Client 4</option>
            </select>
            <input
                type="text"
                placeholder="Deal Name"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
            />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
            </select>
            <input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                min={startDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
            />
            <button type="submit" disabled={!are_dates_valid(startDate, endDate)}>
                {!props.edit ? "CREATE" : "UPDATE"}
            </button>
        </form>
    )
});