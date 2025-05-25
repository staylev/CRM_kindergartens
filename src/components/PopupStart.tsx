import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        попвп
      </Button>
      <Modal title="Начало работы!" open={isModalOpen} okText="Создать" cancelText="Позже" onOk={handleOk} onCancel={handleCancel}>
        <p>Здравтвуйте! рекомендуем для начала создать детский сад</p>
      </Modal>
    </>
  );
};

export default App;