import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Build,
  LocalGasStation,
  Settings,
  AspectRatio,
  Star,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import type { Motorcycle } from '../../types/motorcycle';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  startCollapsed?: boolean;
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({
  motorcycle,
  isFavorite = false,
  onToggleFavorite,
  startCollapsed = false
}) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    engine: !startCollapsed,
    fuel: !startCollapsed,
    chassis: !startCollapsed,
    dimensions: !startCollapsed
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const specSections = [
    {
      id: 'engine',
      title: "Engine",
      icon: <Build />,
      specs: [
        { label: 'Type', value: motorcycle.type },
        { label: 'Displacement', value: motorcycle.displacement },
        { label: 'Engine', value: motorcycle.engine },
        { label: 'Power', value: motorcycle.power },
        { label: 'Torque', value: motorcycle.torque },
        { label: 'Compression', value: motorcycle.compression },
        { label: 'Bore & Stroke', value: motorcycle.bore_stroke },
        { label: 'Valves per Cylinder', value: motorcycle.valves_per_cylinder },
        { label: 'Fuel Control', value: motorcycle.fuel_control },
        { label: 'Ignition', value: motorcycle.ignition },
        { label: 'Lubrication', value: motorcycle.lubrication },
        { label: 'Cooling', value: motorcycle.cooling },
      ]
    },
    {
      id: 'fuel',
      title: "Fuel & Transmission",
      icon: <LocalGasStation />,
      specs: [
        { label: 'Fuel System', value: motorcycle.fuel_system },
        { label: 'Fuel Capacity', value: motorcycle.fuel_capacity },
        { label: 'Gearbox', value: motorcycle.gearbox },
        { label: 'Transmission', value: motorcycle.transmission },
        { label: 'Clutch', value: motorcycle.clutch },
        { label: 'Starter', value: motorcycle.starter },
      ]
    },
    {
      id: 'chassis',
      title: "Chassis & Suspension",
      icon: <Settings />,
      specs: [
        { label: 'Frame', value: motorcycle.frame },
        { label: 'Front Suspension', value: motorcycle.front_suspension },
        { label: 'Front Travel', value: motorcycle.front_wheel_travel },
        { label: 'Rear Suspension', value: motorcycle.rear_suspension },
        { label: 'Rear Travel', value: motorcycle.rear_wheel_travel },
        { label: 'Front Tire', value: motorcycle.front_tire },
        { label: 'Rear Tire', value: motorcycle.rear_tire },
        { label: 'Front Brakes', value: motorcycle.front_brakes },
        { label: 'Rear Brakes', value: motorcycle.rear_brakes },
      ]
    },
    {
      id: 'dimensions',
      title: "Dimensions & Weight",
      icon: <AspectRatio />,
      specs: [
        { label: 'Total Weight', value: motorcycle.total_weight },
        { label: 'Seat Height', value: motorcycle.seat_height },
        { label: 'Total Height', value: motorcycle.total_height },
        { label: 'Total Length', value: motorcycle.total_length },
        { label: 'Total Width', value: motorcycle.total_width },
        { label: 'Ground Clearance', value: motorcycle.ground_clearance },
        { label: 'Wheelbase', value: motorcycle.wheelbase },
      ]
    }
  ];

  return (
    <Card 
      sx={{ 
        maxWidth: 700, 
        width: '100%',
        m: 1, 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          p: 2.5,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Typography 
          variant="h5" 
          component="div" 
          fontWeight="700" 
          sx={{ 
            fontSize: '1.5rem',
            letterSpacing: '0.5px',
            mb: 0.5
          }}
        >
          {motorcycle.year} {motorcycle.make}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.9,
            fontWeight: 500,
            fontSize: '1.2rem'
          }}
        >
          {motorcycle.model}
        </Typography>
        
        {isFavorite && (
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <Star sx={{ color: '#ffd700', fontSize: 28 }} />
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 0 }}>
        {specSections.map((section, sectionIndex) => {
          const validSpecs = section.specs.filter(spec => spec.value && spec.value !== 'N/A');
          if (validSpecs.length === 0) return null;

          return (
            <Box key={section.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderBottom: '1px solid #e9ecef',
                  cursor: 'pointer'
                }}
                onClick={() => toggleSection(section.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {section.icon}
                  <Typography variant="h6" fontWeight="600" color="primary">
                    {section.title}
                  </Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={expandedSections[section.id]}>
                <List dense sx={{ py: 0 }}>
                  {validSpecs.map((spec, specIndex) => (
                    <ListItem
                      key={specIndex}
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: specIndex < validSpecs.length - 1 ? '1px solid #f0f0f0' : 'none',
                        '&:hover': {
                          bgcolor: '#f8f9fa'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              fontWeight="600"
                              sx={{ minWidth: '40%' }}
                            >
                              {spec.label}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.primary"
                              fontWeight="500"
                              sx={{ textAlign: 'right', flex: 1 }}
                            >
                              {spec.value}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              
              {sectionIndex < specSections.length - 1 && <Divider />}
            </Box>
          );
        })}
      </CardContent>

      {onToggleFavorite && (
        <CardActions sx={{ p: 2, bgcolor: '#fafafa' }}>
          <Button 
            fullWidth
            variant={isFavorite ? "outlined" : "contained"}
            onClick={onToggleFavorite}
            startIcon={
              isFavorite ? 
                <Favorite sx={{ color: '#d32f2f' }} /> : 
                <FavoriteBorder />
            }
            sx={{ 
              borderRadius: 2,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              borderColor: isFavorite ? '#d32f2f' : 'transparent',
              color: isFavorite ? '#d32f2f' : 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: isFavorite ? 
                  '0 4px 12px rgba(211, 47, 47, 0.3)' : 
                  '0 4px 12px rgba(25, 118, 210, 0.4)',
                backgroundColor: isFavorite ? 
                  'rgba(211, 47, 47, 0.04)' : 
                  '#1565c0',
              }
            }}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
