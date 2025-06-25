import { Box, HStack } from '@chakra-ui/react'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.25">
      <HStack gap={0} align="stretch" minH="100vh">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <Box flex={1} display="flex" flexDirection="column" bg="gray.25">
          {/* Header */}
          <Header />
          
          {/* Main content */}
          <Box 
            flex={1} 
            p={8} 
            bg="gray.25"
            position="relative"
            overflow="auto"
          >
            {/* Background decoration */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              opacity="0.02"
              pointerEvents="none"
              bg="radial-gradient(circle at 25% 25%, brand.500 1px, transparent 1px)"
              backgroundSize="60px 60px"
            />
            
            {/* Content */}
            <Box position="relative" zIndex={1}>
              {children}
            </Box>
          </Box>
          
          {/* Footer */}
          <Footer />
        </Box>
      </HStack>
    </Box>
  )
}