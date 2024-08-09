import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  background: white;
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 12px;
  border-radius: 0;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #93b6c8;
  box-sizing: border-box;
  font-size: 16px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  margin-top: 0;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  background-color: white;
  width: 100%;
  padding: 11px 20px;
  border: 1px solid #93b6c8;
  box-sizing: border-box;
  flex-direction: row;
  gap: 5px;
`;

const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f3f3f3;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin: 5px;
  background-color: ${({ color }) => color || "#0070f3"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#005bb5"};
  }
`;

const RuongChuaDo = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          const { data } = await axios.get(
            `/api/user/ruong-do?userId=${storedUser.id}`
          );
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching ruong do items:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Title>Rương chứa đồ</Title>

      <Container>
        <ItemTable>
          <thead>
            <tr>
              <TableHeader>Vật phẩm</TableHeader>
              <TableHeader>Giới thiệu và rao bán</TableHeader>
              <TableHeader>Sử dụng</TableHeader>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <TableRow key={item.ruong_do_id}>
                <TableCell>
                  {item.vat_pham_name} ({item.so_luong})
                </TableCell>
                <TableCell>{item.pham_cap}</TableCell>
                <TableCell>
                  <ActionButton color="#0070f3">Sử dụng</ActionButton>
                  <ActionButton color="#f44336" hoverColor="#d32f2f">
                    Nộp bang
                  </ActionButton>
                  <ActionButton color="#4caf50" hoverColor="#388e3c">
                    Hành trang
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </ItemTable>
      </Container>
    </>
  );
};

export default RuongChuaDo;
