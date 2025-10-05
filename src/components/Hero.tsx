import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface HeroProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onLogin }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  TradeMate
                </span>
                <br />
                <span className="text-foreground">
                  {t('hero.title')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={onGetStarted}
                className="group"
              >
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLogin}
                className="group"
              >
                {t('hero.login')}
              </Button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('nav.inventory')}</h3>
                  <p className="text-xs text-muted-foreground">Track stock levels</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <span className="text-secondary font-semibold">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('nav.payments')}</h3>
                  <p className="text-xs text-muted-foreground">UPI & Cash tracking</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-semibold">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('nav.customers')}</h3>
                  <p className="text-xs text-muted-foreground">Build relationships</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={heroImage} 
                alt="TradeMate Dashboard" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Background Elements */}
            <div className="absolute -inset-4 bg-gradient-primary rounded-3xl opacity-20 blur-xl -z-10"></div>
            <div className="absolute top-8 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};