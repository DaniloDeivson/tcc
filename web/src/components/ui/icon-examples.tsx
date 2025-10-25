import React from 'react';
import Icon from './icon';

// Este arquivo serve como documentação e exemplos de uso dos ícones
// Você pode deletar este arquivo após consultar os exemplos

const IconExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Exemplos de Ícones Material Design</h2>
      
      {/* Variantes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Variantes</h3>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="home" variant="filled" />
            <span>Filled</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="home" variant="outlined" />
            <span>Outlined</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="home" variant="round" />
            <span>Round</span>
          </div>
        </div>
      </section>

      {/* Tamanhos */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Tamanhos</h3>
        <div className="flex items-center space-x-4">
          <Icon name="star" size="sm" />
          <Icon name="star" size="md" />
          <Icon name="star" size="lg" />
          <Icon name="star" size="xl" />
        </div>
      </section>

      {/* Ícones Comuns */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Ícones Comuns para Finanças</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="account_balance" />
            <span>account_balance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="attach_money" />
            <span>attach_money</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="trending_up" />
            <span>trending_up</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="trending_down" />
            <span>trending_down</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="savings" />
            <span>savings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="credit_card" />
            <span>credit_card</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="receipt" />
            <span>receipt</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="analytics" />
            <span>analytics</span>
          </div>
        </div>
      </section>

      {/* Navegação */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Ícones de Navegação</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="dashboard" />
            <span>dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="home" />
            <span>home</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="settings" />
            <span>settings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="person" />
            <span>person</span>
          </div>
        </div>
      </section>

      {/* Ações */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Ícones de Ação</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="add" />
            <span>add</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="edit" />
            <span>edit</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="delete" />
            <span>delete</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="search" />
            <span>search</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IconExamples; 