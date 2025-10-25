using NestFin.API.Models;
using NestFin.API.Repositories.Interfaces;
using NestFin.API.Services.Interfaces;

namespace NestFin.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            return await _userRepository.AddAsync(user);
        }

        public async Task UpdateUserAsync(int id, User user)
        {
            var existingUser = await _userRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"User with id {id} not found");

            if (id != user.Id)
                throw new ArgumentException("User id mismatch");

            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"User with id {id} not found");

            await _userRepository.DeleteAsync(user);
        }
    }
}
