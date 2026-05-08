import React from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { SEO } from '../components/SEO';

export const ImpressumPage: React.FC = () => (
  <>
    <SEO
      title="Impressum"
      description="Impressum und Anbieterkennung gemäß § 5 TMG."
      canonical="/impressum"
      noindex
    />
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="inline-block bg-secondary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Rechtliches
          </span>
          <h1 className="text-3xl font-black text-primary mb-3">Impressum</h1>
          <p className="text-slate-500">Angaben gemäß § 5 TMG</p>
        </div>

        <div className="space-y-10 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Anbieter</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 font-medium text-primary">
              <p>SolarKonfigurator</p>
              <p>Hoang Ha Vu</p>
              <p>München, Deutschland</p>
              <p className="mt-2">E-Mail: <a href="mailto:hoangha.vu@outlook.de" className="text-secondary hover:underline">hoangha.vu@outlook.de</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)</h2>
            <p>Hoang Ha Vu (Adresse wie oben)</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Haftungsausschluss</h2>
            <p>
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir keine Gewähr übernehmen. Als Dienstanbieter
              sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
              deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
              des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  </>
);
