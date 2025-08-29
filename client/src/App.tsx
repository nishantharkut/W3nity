import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthState } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/spinner'
import { registerUserForNotifications } from '@/socket'
import { Suspense, useEffect, lazy } from 'react'

import ScrollToTop from './components/ScrollToTop'
import Navbar from '@/components/Navbar'
import Breadcrumbs from './components/BreadCrumbs'
import Footer from '@/components/Footer'
import NotFound from './pages/NotFound'

const Index = lazy(() => import('./pages/Index'))
const FreelancePage = lazy(() => import('./pages/FreelancePage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const GigDetailsPage = lazy(() => import('./pages/GigDetailsPage'))
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'))
const CreateGigPage = lazy(() => import('./pages/CreateGigPage'))
const CreateEventPage = lazy(() => import('./pages/CreateEventPage'))
const ProposalPage = lazy(() => import('./pages/ProposalPage'))
const ChatInterface = lazy(() => import('./pages/ChatInterface'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'))
const PaymentCancelPage = lazy(() => import('./pages/PaymentCancelPage'))
const PaymentSuccessNFT = lazy(() => import('./pages/PaymentSuccessNFT'))

const queryClient = new QueryClient()

const App = () => {
	const { isAuthenticated, user } = useAuthState()

	useEffect(() => {
		if (isAuthenticated && user?._id) {
			registerUserForNotifications(user._id)
		}
	}, [isAuthenticated, user])

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<div className='min-h-screen flex flex-col'>
						<Suspense
							fallback={
								<PageLoader message="Loading..." variant="faded" />
							}
						>
							<ScrollToTop />
							<Routes>
								<Route path='/login' element={<LoginPage />} />
								<Route
									path='/register'
									element={<RegisterPage />}
								/>

								{/* Main app routes with navbar/footer */}
								<Route
									path='/*'
									element={
										<>
											<Navbar />
											<main className='flex-1'>
												<div className='container mx-auto px-4 py-6'>
													<Breadcrumbs />
													<Routes>
														<Route
															path='/'
															element={<Index />}
														/>
														<Route
															path='/dashboard'
															element={
																<DashboardPage />
															}
														/>
														<Route
															path='/freelance'
															element={
																<FreelancePage />
															}
														/>
														<Route
															path='/freelance/create'
															element={
																<CreateGigPage />
															}
														/>
														<Route
															path='/gig/:id'
															element={
																<GigDetailsPage />
															}
														/>
														<Route
															path='/gig/:id/proposal'
															element={
																<ProposalPage />
															}
														/>
														<Route
															path='/events'
															element={
																<EventsPage />
															}
														/>
														<Route
															path='/events/create'
															element={
																<CreateEventPage />
															}
														/>
														<Route
															path='/event/:id'
															element={
																<EventDetailsPage />
															}
														/>
														<Route
															path='/community'
															element={
																<CommunityPage />
															}
														/>
														<Route
															path='/community/:id'
															element={
																<ChatInterface />
															}
														/>
														<Route
															path='/profile'
															element={
																<ProfilePage />
															}
														/>
														<Route
															path='/notifications'
															element={
																<NotificationsPage />
															}
														/>
														<Route
															path='/settings'
															element={
																<SettingsPage />
															}
														/>
														<Route
															path='/payment/:type/:id'
															element={
																<PaymentPage />
															}
														/>
														<Route
															path='/payment/success'
															element={
																<PaymentSuccessPage />
															}
														/>
														<Route
															path='/payment/cancel'
															element={
																<PaymentCancelPage />
															}
														/>
														<Route
															path='/NFTpayment/success'
															element={
																<PaymentSuccessNFT />
															}
														/>

														<Route
															path='*'
															element={
																<NotFound />
															}
														/>
													</Routes>
												</div>
											</main>

											<Footer />
										</>
									}
								/>
							</Routes>
						</Suspense>
					</div>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	)
}

export default App
