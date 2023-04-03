import { FieldType, PivotData } from '@lightdash/common';
import { Table, TableProps } from '@mantine/core';
import React, { FC } from 'react';
import HeaderCell from './HeaderCell';
import IndexCell from './IndexCell';
import { useStyles } from './tableStyles';
import TitleCell from './TitleCell';
import ValueCell from './ValueCell';

type PivotTableProps = TableProps &
    React.RefAttributes<HTMLTableElement> & {
        data: PivotData;
        getMetricLabel: (fieldId: string | null | undefined) => string;
    };

const PivotTable: FC<PivotTableProps> = ({
    data,
    getMetricLabel,
    className,
    ...tableProps
}) => {
    const { cx, classes } = useStyles();

    return (
        <Table
            withBorder
            withColumnBorders
            highlightOnHover
            className={cx(classes.table, className)}
            w="xs"
            {...tableProps}
        >
            <thead>
                {data.headerValueTypes.map(
                    (headerValueType, headerValueTypeIndex) => {
                        const headerValues =
                            data.headerValues[headerValueTypeIndex];

                        return (
                            <tr key={headerValueTypeIndex}>
                                <>
                                    {data.indexValueTypes.map(
                                        (_indexValueType, indexValueIndex) => {
                                            const titleField =
                                                data.titleFields[
                                                    headerValueTypeIndex
                                                ][indexValueIndex];
                                            return (
                                                <TitleCell
                                                    key={indexValueIndex}
                                                    title={titleField}
                                                    getLabel={getMetricLabel}
                                                />
                                            );
                                        },
                                    )}

                                    {headerValues.map(
                                        (headerValue, headerValueIndex) => {
                                            const label =
                                                headerValueType.type ===
                                                    FieldType.METRIC &&
                                                getMetricLabel
                                                    ? getMetricLabel(
                                                          headerValue?.formatted,
                                                      )
                                                    : headerValue?.formatted;
                                            return (
                                                <HeaderCell
                                                    label={label}
                                                    key={headerValueIndex}
                                                />
                                            );
                                        },
                                    )}
                                </>
                            </tr>
                        );
                    },
                )}
            </thead>

            <tbody>
                {data.dataValues.map((row, i) => (
                    <tr key={i}>
                        <>
                            {data.indexValueTypes.map(
                                (indexValueType, indexValueTypeIndex) => {
                                    const d =
                                        data.indexValues[i][indexValueTypeIndex]
                                            ?.formatted;
                                    const label =
                                        indexValueType.type ===
                                            FieldType.METRIC && getMetricLabel
                                            ? getMetricLabel(d)
                                            : d;
                                    return (
                                        <IndexCell
                                            key={indexValueTypeIndex}
                                            label={label}
                                        />
                                    );
                                },
                            )}

                            {row.map((value, rowIndex) => (
                                <ValueCell key={rowIndex} value={value} />
                            ))}
                        </>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default PivotTable;