import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Layout from "../../components/Layout";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 100px);
  flex-direction: row;
  justify-content: space-between;
  background-color: none;
  gap: 20px;
  padding: 0;
  align-items: start;
  box-sizing: border-box;
  @media (max-width: 749px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const LeftSection = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: 1px solid #93b6c8;
  box-sizing: border-box;
  @media (max-width: 749px) {
    width: 90vw;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  box-sizing: border-box;
  @media (max-width: 749px) {
    width: 90vw;
  }
`;

const CharacterContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
`;

const CharacterImage = styled.img`
  max-width: 90%;
  height: auto;
  border-radius: 10px;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  height: 100px;
`;

const Frame = styled.img`
  position: absolute;
  width: 130px;
  z-index: 100;
  height: 130px;
`;

const Avatar = styled.img`
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid white;
  background-color: #f4f4f4;
  z-index: 2;
`;

const Username = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
  text-align: center;
`;

const NgoaiHieu = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #666;
  margin-top: 20px;
  text-align: center;
  line-height: 30px;
  border-top: 1px dashed #93b6c8;
`;

const TaiSanContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px dashed #93b6c8;
  padding: 0;
`;

const TaiSanImage = styled.img`
  height: 50px;
  padding: 0;
`;
const TaiSanValue = styled.div`
  color: #333;
  font-size: 16px;
`;

const ClanName = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #666;
  text-align: center;
  border-top: 1px dashed #93b6c8;
  line-height: 30px;
`;

const ClanRole = styled.div`
  font-size: 18px;
  color: #4caf50;
  font-weight: bold;
  text-align: center;
  border-top: 1px dashed #93b6c8;
  line-height: 40px;
  border-bottom: 1px dashed #93b6c8;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border: 1px solid #93b6c8;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  text-align: center;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBarLabel = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: bold;
`;

const ProgressBar = styled.div`
  flex: 1;
  margin-left: 10px;
  background-color: #e0e0e0;
  overflow: hidden;
  position: relative;
  height: 20px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #4caf50;
  width: ${({ width }) => `${width}%`}; 
  transition: width 0.4s ease;
`;

const ItemsContainer = styled.div`
  margin-top: 10px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: bold;
`;

const ItemValue = styled.div`
  background-color: #ffe58a;
  padding: 5px 15px;
  border-radius: 10px;
  font-weight: bold;
  color: #333;
`;

const FormContainer = styled.div`
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  width: 80%;
  border: 1px solid #93b6c8;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 25px;
  background-color: #b3d7e8;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #93b6c8;
  }
`;

const MemberPage = ({ id }) => {
  const [user, setUser] = useState(null);
  const [levelData, setLevelData] = useState(null); // Initialize levelData in state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/member/${id}`);
        const userData = response.data;

        const levelResponse = await axios.post(`/api/user/dot-pha/level-info`, {
          level: userData.level,
        });

        setUser(userData);
        setLevelData(levelResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const expProgress = user && levelData && levelData.exp > 0 ? (user.exp / levelData.exp) * 100 : 0;

  const getClanRole = (roleId) => {
    const roles = {
      1: "Tạp dịch, linh đồng",
      2: "Ngoại môn đệ tử",
      3: "Nội môn đệ tử",
      4: "Hộ pháp",
      5: "Trưởng lão",
      6: "Đại trưởng lão",
      7: "Chưởng môn",
    };
    return roles[roleId] || "Unknown Role";
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Container>
        <LeftSection>
          <CharacterContainer>
            <CharacterImage src="/nv1.png" alt="Character" />{" "}
          </CharacterContainer>
        </LeftSection>

        <RightSection>
          <Section>
            <AvatarContainer>
              <Frame src="/frame.png" alt="Avatar Frame" />
              <Avatar
                src={
                  user.image
                    ? user.image
                    : "/logo2.png"
                }
                alt={user.username || "Default Avatar"}
              />
            </AvatarContainer>
            <Username>{user.username}</Username>
            <NgoaiHieu>{user.ngoai_hieu}</NgoaiHieu>
            <TaiSanContainer>
              <TaiSanImage src="/gold.png"></TaiSanImage>
              <TaiSanValue>{user.tai_san}</TaiSanValue>
            </TaiSanContainer>
            <ClanName>{user.clan_name}</ClanName>
            <ClanRole>{getClanRole(user.clan_role)}</ClanRole>
          </Section>

          <Section>
            <SectionTitle>Tu luyện & Vật phẩm</SectionTitle>
            <ProgressContainer>
              <ProgressBarContainer>
                <ProgressBarLabel>Phàm Nhân</ProgressBarLabel>
                <ProgressBar>
                  <Progress width={expProgress} />
                </ProgressBar>
                {user.exp}/{levelData.exp}
              </ProgressBarContainer>
            </ProgressContainer>
            <ItemsContainer>
              {user.items &&
                user.items.map((item) => (
                  <ItemRow key={item.name}>
                    <ItemLabel>{item.name}</ItemLabel>
                    <ItemValue>{item.value}</ItemValue>
                  </ItemRow>
                ))}
            </ItemsContainer>
          </Section>
          <Section>
            <FormContainer>
              <SectionTitle>Tặng bạc</SectionTitle>
              <Input type="text" placeholder="Nhập số bạc mà bạn muốn tặng" />
              <Button>Gửi bạc</Button>
            </FormContainer>
          </Section>
        </RightSection>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}

export default MemberPage;
