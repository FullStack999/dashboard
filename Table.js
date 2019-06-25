import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import {TableRow, TableBody, TableCell, TableHead, Paper} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
    h6: {
        padding: '15px'
    },
    tableHead: {
        background: 'green'
    }
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function DenseTable({data, title}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <h6 className={classes.h6}>
                    {title}
                </h6>
                <Table className={classes.table} size="small" title>
                    <TableHead>
                        <TableRow>
                            <TableCell>Plan Name</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Day part</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {data && data.map((row, key) => (
                            key >= data.length - 10 &&
                            <TableRow key={key}>
                                <TableCell>{row.Description}</TableCell>
                                <TableCell>{row.period}</TableCell>
                                <TableCell>{row.sector}</TableCell>
                                <TableCell>{row.dayPart}</TableCell>
                            </TableRow>
                        ))}



                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}

