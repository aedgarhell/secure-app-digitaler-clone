import { SetMetadata } from '@nestjs/common';

/**
 * Key used by the Roles decorator to store the required roles metadata.
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator adds required roles metadata to the route handler. The
 * RolesGuard will use this metadata to determine if the current user is
 * authorized. Usage:
 *
 * ```ts
 * @Roles('ADMIN')
 * @Get('admin-only')
 * findAdminData() { ... }
 * ```
 *
 * @param roles A list of roles allowed to access the route
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
