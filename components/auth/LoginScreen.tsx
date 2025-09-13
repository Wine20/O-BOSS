
import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }
    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    // In a real app, this would be an API call. Here we use localStorage.
    const existingUser = localStorage.getItem('genesis-user');
    if (existingUser) {
      setError('Já existe uma conta. Por favor, faça o login.');
      return;
    }

    localStorage.setItem('genesis-user', JSON.stringify({ username, password }));
    setError('');
    alert('Conta criada com sucesso! Agora você pode fazer o login.');
    setIsLoginView(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('genesis-user');
    if (!storedUser) {
      setError('Nenhuma conta encontrada. Por favor, crie uma.');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.username === username && user.password === password) {
      setError('');
      onLoginSuccess();
    } else {
      setError('ID Génesis ou senha inválidos.');
    }
  };

  const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
      {...props}
      className="w-full bg-black/30 border border-yellow-500/30 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
    />
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-sm bg-black/40 backdrop-blur-xl rounded-lg border border-yellow-500/40 shadow-2xl shadow-yellow-600/20 p-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
            {isLoginView ? 'Génesis ID' : 'Criar ID'}
          </h1>
          <p className="text-gray-300 mt-2">
            {isLoginView ? 'Acesse o seu universo.' : 'Junte-se ao universo.'}
          </p>
        </div>
        
        <form onSubmit={isLoginView ? handleLogin : handleCreateAccount} className="space-y-4">
          <FormInput
            type="text"
            placeholder="ID Génesis"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Génesis ID"
          />
          <FormInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          {!isLoginView && (
            <FormInput
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm Password"
            />
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-black font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
          >
            {isLoginView ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="text-sm text-yellow-300/80 hover:text-yellow-200 transition-colors"
          >
            {isLoginView ? 'Não tem uma conta? Crie uma.' : 'Já tem uma conta? Faça o login.'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
