using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class AdminRequestRepository : IAdminRequestRepository
{
    private readonly ApplicationDbContext _context;

    public AdminRequestRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminRequest?> GetByIdAsync(int id)
    {
        return await _context.AdminRequests
            .Include(r => r.Requester)
            .Include(r => r.ProcessedBy)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<AdminRequest>> GetAllAsync()
    {
        return await _context.AdminRequests
            .Include(r => r.Requester)
            .Include(r => r.ProcessedBy)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<AdminRequest>> GetPendingAsync()
    {
        return await _context.AdminRequests
            .Include(r => r.Requester)
            .Where(r => r.Status == SmartLogist.Domain.Enums.RequestStatus.Pending)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(AdminRequest request)
    {
        await _context.AdminRequests.AddAsync(request);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(AdminRequest request)
    {
        _context.Set<AdminRequest>().Update(request);
        await _context.SaveChangesAsync();
    }

    public async Task ClearProcessedAsync()
    {
        var processed = await _context.Set<AdminRequest>()
            .Where(r => r.Status != SmartLogist.Domain.Enums.RequestStatus.Pending)
            .ToListAsync();
            
        _context.Set<AdminRequest>().RemoveRange(processed);
        await _context.SaveChangesAsync();
    }
}
