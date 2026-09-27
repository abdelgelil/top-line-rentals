import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ApartmentForm from '../../components/admin/ApartmentForm';
import { fetchApartmentById } from '../../services/api';

export default function AdminEditApartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchApartmentById(id).then(({ data }) => {
      if (active) setApartment(data?.data || data);
    }).catch(() => {
      if (active) setError(t('Failed to load apartment'));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id, t]);

  const goBack = () => navigate('/admin/apartments');

  if (loading) return <div className="p-8 text-center text-slate-500">{t('Loading Apartments...')}</div>;
  if (error || !apartment) return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <p className="mb-5 text-slate-600 dark:text-slate-300">{error || t('Apartment not found')}</p>
      <Link to="/admin/apartments" className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">{t('Back to Apartments')}</Link>
    </div>
  );

  return <ApartmentForm isOpen pageMode initialData={apartment} onClose={goBack} />;
}
