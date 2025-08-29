"use client";

import React from 'react';
import { redirect } from 'next/navigation';

// Redirecionar para a página de documentos do departamento
const UserPage = () => {
  redirect('/user/documentos');
};

export default UserPage;
