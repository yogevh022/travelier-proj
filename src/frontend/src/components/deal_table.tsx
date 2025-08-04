import type { DealType } from '../../../types/dealType';
import React, { useContext, useState } from 'react';
import "./deal_table_styles.css";
import { DealEditorContext, dealEditorContext } from '../App';

type DealTableProps = {
    deals: DealType[];
    sortField?: keyof DealType;
    sortAsc?: boolean;
}

export const DealTable: React.FC<DealTableProps> = (props)=> {
    // by default sorting by creation asc
    const [sortField, setSortField] = useState<keyof DealType>("_id");
    const [sortAsc, setSortAsc] = useState(true);
    const dealEditorHandle = useContext(dealEditorContext);
    const handleChangeSort = (fieldName: string) => {
        if (fieldName == sortField) {
            setSortAsc(!sortAsc);
            return;
        }
        setSortAsc(true);
        setSortField(fieldName as keyof DealType);
    }

    const fetch_delete = (deal_id: string) => {
        fetch(`/api/deals/${deal_id}`, {
            method: 'DELETE',
        }).then((res) => {
            if (res.ok) {
                dealEditorHandle?.refetch();
            }
        }).catch((err) => {
            console.error(err);
        })
    }

    const handleEditDeal = (deal: DealType) => {
        dealEditorHandle?.openDealEditor(deal);
    }

    const handleDeleteDeal = (deal_id: string) => {
        fetch_delete(deal_id);
    }

    const sortedDeals = [...props.deals].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => handleChangeSort("client")}>Client</th>
                    <th onClick={() => handleChangeSort("name")}>Name</th>
                    <th onClick={() => handleChangeSort("status")}>Status</th>
                    <th onClick={() => handleChangeSort("start_date")}>Start Date</th>
                    <th onClick={() => handleChangeSort("end_date")}>End Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sortedDeals.map((deal, index) => (
                    <tr key={deal._id}>
                        <td>{deal.client}</td>
                        <td>{deal.name}</td>
                        <td>{deal.status}</td>
                        {/* (split T)[0] to remove the time */}
                        <td>{deal.start_date.split("T")[0]}</td>
                        <td>{deal.end_date.split("T")[0]}</td>
                        <td>
                            <button onClick={() => handleEditDeal(deal)}>Edit</button>
                            <button onClick={() => handleDeleteDeal(deal._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}