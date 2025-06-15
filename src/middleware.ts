
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/auth';
import { cookies } from 'next/headers';

// Define the roles as a union type
type UserRole = 'ROLE_ADMIN' | 'ROLE_ACCOUNTANT' | 'ROLE_SALES';

// Role-based protected routes mapping
const roleRouteMap: Record<UserRole, string[]> = {
  ROLE_ADMIN: [
    '/admin-dashboard',
               '/adduser'
              ],
    ROLE_ACCOUNTANT: [
    '/dashboard',
    '/adminstration',
    '/cashbook',
    '/datewise-distreport',
    '/datewise-employeepay-report',
    '/datewise-expense-report',
    '/datewise-officepay-report',
    '/datewise-officerecev-report',
    '/datewise-profitreport',
    '/datewise-purchase-ledger',
    '/datewise-retailerpay-report',
    '/datewise-supplierpay-report',
    '/details-retailer-ledger',
    '/details-supplier',
    '/dp-dist-report',
    '/employee-pay-report',
    '/expense-report',
    '/invoice',
    '/office-pay-report',
    '/office-receve-report',
    '/order-create',
    '/order-delivery',
    '/payment',
    '/profit-report',
    '/purchase',
    '/purchase-ledger',
    '/receive',
    '/retailer-ledger',
    '/retailer-pay-report',
    '/stockreport',
    '/supplier-ledger',
    '/supplier-pay-report',
    '/retailer-commission-report',
    '/supplier-commission-report',
    '/datewise-retailerCommission',
    '/datewise-supplierCommission',
  ],
  ROLE_SALES: [
    '/orderlist',
    '/sales-admin',
    '/sales-dashboard',
    '/sales-details-retailer-ledger',
    '/sales-order',
    '/sales-retailer-ledger',
  ],
  
};
const publicRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the path is public
  const isPublicRoute = publicRoutes.includes(path);

  // Find the roles that protect the current route
  const protectingRoles = (Object.keys(roleRouteMap) as UserRole[]).filter((role) =>
    roleRouteMap[role].includes(path)
  );

  const cookie = cookies().get('session_charu')?.value;

  // If no session cookie is found and the route is protected, redirect to the home page
  if (!cookie && protectingRoles.length > 0) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  try {
    const session = await decrypt(cookie);

    // If session decryption fails or userId is missing, redirect for protected routes
    if (!session?.username && protectingRoles.length > 0) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (session?.username && session?.roles) {
      // Check if user role matches the role protecting the route
      if (
        protectingRoles.length > 0 &&
        !protectingRoles.includes(session.roles as UserRole)
      ) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }

      // Redirect logged-in users accessing public routes to their respective dashboards
      if (isPublicRoute) {
        if (
          session.roles === 'ROLE_ADMIN' &&
          !req.nextUrl.pathname.startsWith('/admin-dashboard')
        ) {
          return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl));
        }
        if (
          session.roles === 'ROLE_ACCOUNTANT' &&
          !req.nextUrl.pathname.startsWith('/dashboard')
        ) {
          return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
        }
        if (
          session.roles === 'ROLE_SALES' &&
          !req.nextUrl.pathname.startsWith('/sales-dashboard')
        ) {
          return NextResponse.redirect(new URL('/sales-dashboard', req.nextUrl));
        }
        
      }
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    // Redirect to login page or custom error page if needed
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Allow request to continue if all checks are passed
  return NextResponse.next();
}

export const config = {
   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
