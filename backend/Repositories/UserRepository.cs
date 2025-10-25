using Microsoft.EntityFrameworkCore;
using NestFin.API.Data;
using NestFin.API.Models;
using NestFin.API.Repositories.Interfaces;

namespace NestFin.API.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
