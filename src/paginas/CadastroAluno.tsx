import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiArrowRight, FiSave } from 'react-icons/fi'
import {
    Card,
    ContainerPagina,
    CabecalhoPagina,
    Titulo,
    Subtitulo,
    Linha,
    GrupoCampo,
    Rotulo,
    TextoErro,
    BarraAcoes,
    BotaoVoltar,
    CampoBase
} from '../estilos/componentes'
import { BarraEtapas, EtapaPill, Aviso, Separador, BotaoEtapa, BadgeMenor } from './CadastroAluno.estilos'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { esquemaAluno, type ValoresAlunoFormulario } from '../utils/validacoes'
import { calcularIdadePorDataISO, ehMenorDeIdade } from '../utils/datas'
import { buscarEnderecoPorCEP } from '../servicos/viacep.servico'
import { usarDadosCadastroAluno } from '../hooks/usarDadosCadastroAluno'
import { usarAutenticacao } from '../hooks/usarAutenticacao'
import { criarAluno, buscarAluno, atualizarAluno } from '../servicos/alunos.servico'
import { normalizarCEP, normalizarTelefone } from '../utils/normalizar'
import { Carregando } from '../componentes/layout/Carregando'

// Smart Web Components
import { Input } from 'smart-webcomponents-react/input'
import { MaskedTextBox } from 'smart-webcomponents-react/maskedtextbox'
import { TextArea } from 'smart-webcomponents-react/textarea'
import { DateInput } from 'smart-webcomponents-react/dateinput'
import { DropdownSelect } from '../componentes/DropdownSelect'

type Etapa = 1 | 2 | 3

export function CadastroAluno() {
    const { id: alunoId } = useParams<{ id: string }>()
    const editando = Boolean(alunoId)
    const navegar = useNavigate()

    const [etapa, setEtapa] = useState<Etapa>(1)
    const [buscandoCEP, setBuscandoCEP] = useState(false)
    const [carregandoAluno, setCarregandoAluno] = useState(!!editando)
    const numeroRef = useRef<any>(null)
    const { usuarioSistema } = usarAutenticacao()

    const {
        control,
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        trigger,
        handleSubmit,
        formState: { errors }
    } = useForm<ValoresAlunoFormulario>({
        resolver: zodResolver(esquemaAluno),
        defaultValues: {
            nomeCompleto: '',
            dataNascimento: '',
            contatos: { telefoneAlunoWhatsApp: '', email: '', telefonePaiWhatsApp: '' },
            endereco: { naoSabeCEP: false, uf: 'MG', cep: '', logradouro: '', numero: '', bairro: '', cidade: '', complemento: '' },
            responsavel: { nomeCompleto: '', parentesco: 'Pai', telefoneWhatsApp: '' },
            oficina: '',
            nivel: '',
            observacoes: '',
            status: 'ativo'
        },
        mode: 'onChange'
    })

    const { carregando: carregandoDados, oficinas, niveis } = usarDadosCadastroAluno()

    const dataNascimento = watch('dataNascimento')
    const naoSabeCEP = watch('endereco.naoSabeCEP')

    const idadeCalculada = useMemo(() => {
        if (!dataNascimento || dataNascimento.length < 10) return 0
        return calcularIdadePorDataISO(dataNascimento)
    }, [dataNascimento])

    const menor = !!(dataNascimento && dataNascimento.length === 10 && ehMenorDeIdade(idadeCalculada))

    const toastCarregadoRef = useRef(false)

    useEffect(() => {
        async function carregarAlunoParaEdicao() {
            if (!editando) return
            if (!usuarioSistema?.uid || !alunoId) return
            // Evita execução duplicada (React StrictMode dev)
            if (toastCarregadoRef.current) return
            toastCarregadoRef.current = true

            try {
                const aluno: any = await buscarAluno(usuarioSistema.uid, alunoId)

                if (!aluno) {
                    toast.error('Aluno não encontrado.')
                    navegar('/app/alunos')
                    return
                }

                // ---- Campos principais
                setValue('nomeCompleto', aluno.nomeCompleto || '')
                setValue('dataNascimento', aluno.dataNascimento || '')

                // ---- Contatos
                setValue('contatos.telefoneAlunoWhatsApp', aluno.contatos?.telefoneAlunoWhatsApp || '')
                setValue('contatos.telefonePaiWhatsApp', aluno.contatos?.telefonePaiWhatsApp || '')
                setValue('contatos.email', aluno.contatos?.email || '')

                // ---- Endereço
                setValue('endereco.naoSabeCEP', aluno.endereco?.naoSabeCEP ?? false)
                setValue('endereco.cep', aluno.endereco?.cep || '')
                setValue('endereco.logradouro', aluno.endereco?.logradouro || '')
                setValue('endereco.numero', aluno.endereco?.numero || '')
                setValue('endereco.complemento', aluno.endereco?.complemento || '')
                setValue('endereco.bairro', aluno.endereco?.bairro || '')
                setValue('endereco.cidade', aluno.endereco?.cidade || '')
                setValue('endereco.uf', aluno.endereco?.uf || 'MG')

                // ---- Oficina / nível / status
                setValue('oficina', aluno.oficina || '')
                setValue('nivel', aluno.nivel || '')
                setValue('status', aluno.status || 'ativo')
                setValue('observacoes', aluno.observacoes || '')

                // ---- Responsável (se existir)
                if (aluno.responsavel) {
                    setValue('responsavel.nomeCompleto', aluno.responsavel.nomeCompleto || '')
                    setValue('responsavel.parentesco', aluno.responsavel.parentesco || 'Pai')
                    setValue('responsavel.telefoneWhatsApp', aluno.responsavel.telefoneWhatsApp || '')
                } else {
                    // limpa responsavel pra não validar indevidamente
                    setValue('responsavel', undefined as any)
                }

                toast.info('Aluno carregado para edição.')
            } catch (e) {
                console.error(e)
                toast.error('Erro ao carregar aluno.')
                // Reset ref on error to allow retry if component stays mounted (rare)
                toastCarregadoRef.current = false
            } finally {
                setCarregandoAluno(false)
            }
        }

        carregarAlunoParaEdicao()
    }, [editando, alunoId, usuarioSistema?.uid, navegar, setValue])

    async function aoBuscarCEP(cepDigitado: string) {
        if (naoSabeCEP) return
        const cepNums = cepDigitado.replace(/\D/g, '')
        if (cepNums.length !== 8) return

        setBuscandoCEP(true)
        try {
            const endereco = await buscarEnderecoPorCEP(cepNums)
            if (!endereco) {
                setError('endereco.cep', { type: 'manual', message: 'CEP não encontrado. Preencha manualmente.' })
                return
            }

            clearErrors('endereco.cep')
            setValue('endereco.logradouro', endereco.logradouro || '')
            setValue('endereco.bairro', endereco.bairro || '')
            setValue('endereco.cidade', endereco.localidade || '')
            setValue('endereco.uf', endereco.uf || 'MG')

            // Focar no número após preencher o endereço
            setTimeout(() => {
                numeroRef.current?.focus()
            }, 100)
        } finally {
            setBuscandoCEP(false)
        }
    }

    // Limpar responsável se não for menor
    useEffect(() => {
        // Só limpa se não estiver carregando (para evitar limpar ao editar)
        if (!carregandoAluno && !menor) {
            setValue('responsavel', undefined)
        }
    }, [menor, setValue, carregandoAluno])

    async function avancarEtapa() {
        let camposParaValidar: any[] = []

        if (etapa === 1) {
            camposParaValidar = ['nomeCompleto', 'dataNascimento', 'contatos.telefoneAlunoWhatsApp']
            if (menor) {
                camposParaValidar.push('responsavel.nomeCompleto', 'responsavel.parentesco', 'responsavel.telefoneWhatsApp')
            }
        } else if (etapa === 2) {
            camposParaValidar = ['endereco.logradouro', 'endereco.numero', 'endereco.bairro', 'endereco.cidade', 'endereco.uf']
            if (!naoSabeCEP) {
                camposParaValidar.push('endereco.cep')
            }
        }

        const valid = await trigger(camposParaValidar)
        if (valid) {
            setEtapa((e) => (e + 1) as any)
        }
    }

    async function aoSalvar(valores: ValoresAlunoFormulario) {
        if (!usuarioSistema?.uid) {
            toast.error('Usuário não autenticado.')
            return
        }

        const telefoneAlunoNumeros = normalizarTelefone(valores.contatos.telefoneAlunoWhatsApp)
        const telefonePaiNumeros = normalizarTelefone(valores.contatos.telefonePaiWhatsApp)
        const telefoneResponsavelNumeros = normalizarTelefone(valores.responsavel?.telefoneWhatsApp)
        const cepNumeros = normalizarCEP(valores.endereco.cep)

        const dadosParaSalvar = {
            nomeCompleto: valores.nomeCompleto.trim(),
            dataNascimento: valores.dataNascimento,
            idade: idadeCalculada,
            ehMenorDeIdade: menor,
            fotoUrl: undefined,
            fotoPublicId: undefined,
            responsavel: menor
                ? {
                    nomeCompleto: valores.responsavel?.nomeCompleto?.trim() || '',
                    parentesco: valores.responsavel?.parentesco || 'Pai',
                    telefoneWhatsApp: valores.responsavel?.telefoneWhatsApp || '',
                    telefoneNumeros: telefoneResponsavelNumeros
                }
                : undefined,
            contatos: {
                telefoneAlunoWhatsApp: valores.contatos.telefoneAlunoWhatsApp,
                telefoneAlunoNumeros,
                telefonePaiWhatsApp: valores.contatos.telefonePaiWhatsApp || undefined,
                telefonePaiNumeros: telefonePaiNumeros || undefined,
                email: valores.contatos.email ? valores.contatos.email.trim() : undefined
            },
            endereco: {
                naoSabeCEP: valores.endereco.naoSabeCEP,
                cep: valores.endereco.naoSabeCEP ? undefined : (valores.endereco.cep || ''),
                cepNumeros: valores.endereco.naoSabeCEP ? undefined : (cepNumeros || undefined),
                logradouro: valores.endereco.logradouro.trim(),
                numero: valores.endereco.numero.trim(),
                complemento: valores.endereco.complemento?.trim() || undefined,
                bairro: valores.endereco.bairro.trim(),
                cidade: valores.endereco.cidade.trim(),
                uf: valores.endereco.uf.trim().toUpperCase()
            },
            oficina: valores.oficina,
            nivel: valores.nivel,
            status: valores.status,
            observacoes: valores.observacoes?.trim() || undefined
        }

        try {
            if (!usuarioSistema?.uid) {
                toast.error('Usuário não autenticado.')
                return
            }

            if (editando && alunoId) {
                await atualizarAluno(usuarioSistema.uid, alunoId, dadosParaSalvar)
                toast.success('Aluno atualizado com sucesso!')
            } else {
                await criarAluno(usuarioSistema.uid, dadosParaSalvar)
                toast.success('Aluno cadastrado com sucesso!')
            }

            navegar('/app/alunos')
        } catch (e) {
            console.error(e)
            toast.error('Não foi possível salvar o aluno.')
        }
    }

    if (carregandoAluno) return <Carregando />

    return (
        <ContainerPagina>
            <CabecalhoPagina>
                <div style={{ width: '100%' }}>
                    <BotaoVoltar onClick={() => navegar('/app/alunos')}>
                        <FiArrowLeft /> Voltar para lista
                    </BotaoVoltar>
                    <Titulo>{editando ? 'Editar aluno' : 'Cadastro de aluno'}</Titulo>
                    <Subtitulo>
                        Etapa {etapa} de 3 • Idade: <strong>{idadeCalculada > 0 ? idadeCalculada : '-'}</strong>{' '}
                        {(menor && idadeCalculada > 0) && <BadgeMenor>Menor de idade</BadgeMenor>}
                    </Subtitulo>
                </div>
            </CabecalhoPagina>

            <BarraEtapas $etapa={etapa}>
                <EtapaPill type="button" $ativa={etapa >= 1} data-label="Dados">1</EtapaPill>
                <EtapaPill type="button" $ativa={etapa >= 2} data-label="Endereço">2</EtapaPill>
                <EtapaPill type="button" $ativa={etapa >= 3} data-label="Oficina">3</EtapaPill>
            </BarraEtapas>

            <Card>
                <form onSubmit={handleSubmit(aoSalvar, (errors) => {
                    console.error('Erro de validação:', errors)
                    toast.error('Verifique os campos obrigatórios.')
                })} style={{ display: 'grid', gap: 14 }}>
                    {etapa === 1 && (
                        <>
                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Nome completo</Rotulo>
                                    <Controller
                                        control={control}
                                        name="nomeCompleto"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Ex: João da Silva"
                                                onChange={(e: any) => field.onChange(e.detail?.value ?? (e.target as any)?.value)}
                                            />
                                        )}
                                    />
                                    {errors.nomeCompleto && <TextoErro>{errors.nomeCompleto.message}</TextoErro>}
                                </GrupoCampo>
                            </Linha>

                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Data de nascimento</Rotulo>
                                    <Controller
                                        control={control}
                                        name="dataNascimento"
                                        render={({ field }) => (
                                            <CampoBase
                                                {...field}
                                                type="date"
                                                placeholder="dd/mm/aaaa"
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        )}
                                    />
                                    {errors.dataNascimento && <TextoErro>{errors.dataNascimento.message}</TextoErro>}
                                </GrupoCampo>

                                <GrupoCampo>
                                    <Rotulo>WhatsApp do aluno</Rotulo>
                                    <Controller
                                        control={control}
                                        name="contatos.telefoneAlunoWhatsApp"
                                        render={({ field }) => (
                                            <MaskedTextBox
                                                value={field.value}
                                                mask="(00)00000-0000"
                                                placeholder="(31)98765-4321"
                                                onChange={(e: any) => field.onChange(e.detail.value)}
                                            />
                                        )}
                                    />
                                    {errors.contatos?.telefoneAlunoWhatsApp && (
                                        <TextoErro>{errors.contatos.telefoneAlunoWhatsApp.message}</TextoErro>
                                    )}
                                </GrupoCampo>
                            </Linha>

                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>WhatsApp do pai/mãe (opcional)</Rotulo>
                                    <Controller
                                        control={control}
                                        name="contatos.telefonePaiWhatsApp"
                                        render={({ field }) => (
                                            <MaskedTextBox
                                                value={field.value}
                                                mask="(00)00000-0000"
                                                placeholder="(31)98765-4321"
                                                onChange={(e: any) => field.onChange(e.detail.value)}
                                            />
                                        )}
                                    />
                                </GrupoCampo>

                                <GrupoCampo>
                                    <Rotulo>E-mail (opcional)</Rotulo>
                                    <Controller
                                        control={control}
                                        name="contatos.email"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="ex: aluno@email.com"
                                                onChange={(e: any) => field.onChange(e.detail.value)}
                                            />
                                        )}
                                    />
                                    {errors.contatos?.email && <TextoErro>{errors.contatos.email.message}</TextoErro>}
                                </GrupoCampo>
                            </Linha>

                            {menor && (
                                <>
                                    <Separador />
                                    <Titulo style={{ fontSize: 16, margin: 0 }}>Responsável (obrigatório)</Titulo>

                                    <Linha>
                                        <GrupoCampo>
                                            <Rotulo>Nome completo do responsável</Rotulo>
                                            <Controller
                                                control={control}
                                                name="responsavel.nomeCompleto"
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        onChange={(e: any) => field.onChange(e.detail.value)}
                                                    />
                                                )}
                                            />
                                            {errors.responsavel?.nomeCompleto && <TextoErro>{errors.responsavel.nomeCompleto.message}</TextoErro>}
                                        </GrupoCampo>
                                    </Linha>

                                    <Linha>
                                        <GrupoCampo>
                                            <Rotulo>Parentesco</Rotulo>
                                            <Controller
                                                control={control}
                                                name="responsavel.parentesco"
                                                render={({ field }) => (
                                                    <DropdownSelect
                                                        value={field.value}
                                                        onChange={(v) => field.onChange(v)}
                                                        options={["Pai", "Mãe", "Tutor", "Outro"].map(v => ({ label: v, value: v }))}
                                                        placeholder="Selecione..."
                                                    />
                                                )}
                                            />
                                        </GrupoCampo>

                                        <GrupoCampo>
                                            <Rotulo>WhatsApp do responsável</Rotulo>
                                            <Controller
                                                control={control}
                                                name="responsavel.telefoneWhatsApp"
                                                render={({ field }) => (
                                                    <MaskedTextBox
                                                        value={field.value}
                                                        mask="(00)00000-0000"
                                                        placeholder="(31)98765-4321"
                                                        onChange={(e: any) => field.onChange(e.detail.value)}
                                                    />
                                                )}
                                            />
                                            {errors.responsavel?.telefoneWhatsApp && (
                                                <TextoErro>{errors.responsavel.telefoneWhatsApp.message}</TextoErro>
                                            )}
                                        </GrupoCampo>
                                    </Linha>
                                </>
                            )}
                            <Aviso>💡 Dica: ao preencher a data de nascimento, a idade é calculada automaticamente.</Aviso>
                        </>
                    )}

                    {etapa === 2 && (
                        <>
                            <Linha>
                                <GrupoCampo style={{ minWidth: 240 }}>
                                    <Rotulo>
                                        <input type="checkbox" {...register('endereco.naoSabeCEP')} /> Não sei o CEP
                                    </Rotulo>
                                </GrupoCampo>
                            </Linha>

                            {!naoSabeCEP && (
                                <Linha>
                                    <GrupoCampo>
                                        <Rotulo>CEP</Rotulo>
                                        <Controller
                                            control={control}
                                            name="endereco.cep"
                                            render={({ field }) => (
                                                <MaskedTextBox
                                                    value={field.value}
                                                    mask="00.000-000"
                                                    placeholder="30.020-000"
                                                    onChange={(e: any) => {
                                                        const val = e.detail.value;
                                                        field.onChange(val)
                                                        if (val && val.replace(/\D/g, '').length === 8) {
                                                            aoBuscarCEP(val)
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                        {buscandoCEP && <Aviso>Buscando CEP...</Aviso>}
                                        {errors.endereco?.cep && <TextoErro>{errors.endereco.cep.message}</TextoErro>}
                                    </GrupoCampo>
                                </Linha>
                            )}

                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Logradouro</Rotulo>
                                    <Controller
                                        control={control}
                                        name="endereco.logradouro"
                                        render={({ field }) => (
                                            <Input {...field} onChange={(e: any) => field.onChange(e.detail.value)} />
                                        )}
                                    />
                                    {errors.endereco?.logradouro && <TextoErro>{errors.endereco.logradouro.message}</TextoErro>}
                                </GrupoCampo>

                                <GrupoCampo>
                                    <Rotulo>Número</Rotulo>
                                    <Controller
                                        control={control}
                                        name="endereco.numero"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                ref={numeroRef}
                                                // Garantir que seja apenas números
                                                onChange={(e: any) => {
                                                    const rawValue = e.detail?.value ?? (e.target as any)?.value
                                                    const numericValue = rawValue ? rawValue.replace(/\D/g, '') : ''
                                                    field.onChange(numericValue)
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.endereco?.numero && <TextoErro>{errors.endereco.numero.message}</TextoErro>}
                                </GrupoCampo>
                            </Linha>

                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Complemento (opcional)</Rotulo>
                                    <Controller
                                        control={control}
                                        name="endereco.complemento"
                                        render={({ field }) => (
                                            <Input {...field} onChange={(e: any) => field.onChange(e.detail.value)} />
                                        )}
                                    />
                                </GrupoCampo>

                                <GrupoCampo>
                                    <Rotulo>Bairro</Rotulo>
                                    <Controller
                                        control={control}
                                        name="endereco.bairro"
                                        render={({ field }) => (
                                            <Input {...field} onChange={(e: any) => field.onChange(e.detail.value)} />
                                        )}
                                    />
                                    {errors.endereco?.bairro && <TextoErro>{errors.endereco.bairro.message}</TextoErro>}
                                </GrupoCampo>
                            </Linha>

                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Cidade</Rotulo>
                                    <Controller
                                        control={control}
                                        name="endereco.cidade"
                                        render={({ field }) => (
                                            <Input {...field} onChange={(e: any) => field.onChange(e.detail.value)} />
                                        )}
                                    />
                                    {errors.endereco?.cidade && <TextoErro>{errors.endereco.cidade.message}</TextoErro>}
                                </GrupoCampo>

                                <GrupoCampo>
                                    <Rotulo>UF</Rotulo>
                                    <Controller
                                        control={control}
                                        name="endereco.uf"
                                        render={({ field }) => (
                                            <Input {...field} placeholder="MG" onChange={(e: any) => field.onChange(e.detail.value)} />
                                        )}
                                    />
                                    {errors.endereco?.uf && <TextoErro>{errors.endereco.uf.message}</TextoErro>}
                                </GrupoCampo>
                            </Linha>
                        </>
                    )}

                    {etapa === 3 && (
                        <>
                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Oficina</Rotulo>
                                    <Controller
                                        control={control}
                                        name="oficina"
                                        render={({ field }) => (
                                            <DropdownSelect
                                                value={field.value}
                                                onChange={(v) => field.onChange(v)}
                                                options={oficinas.length ? oficinas.map(o => ({ label: o, value: o })) : [{ label: 'Carregando...', value: '' }]}
                                                placeholder="Selecione a oficina"
                                            />
                                        )}
                                    />
                                    {errors.oficina && <TextoErro>{errors.oficina.message}</TextoErro>}
                                </GrupoCampo>

                                <GrupoCampo>
                                    <Rotulo>Nível</Rotulo>
                                    <Controller
                                        control={control}
                                        name="nivel"
                                        render={({ field }) => (
                                            <DropdownSelect
                                                value={field.value}
                                                onChange={(v) => field.onChange(v)}
                                                options={niveis.map(n => ({ label: n, value: n }))}
                                                placeholder="Selecione o nível"
                                            />
                                        )}
                                    />
                                    {errors.nivel && <TextoErro>{errors.nivel.message}</TextoErro>}
                                </GrupoCampo>
                            </Linha>

                            <Linha>
                                <GrupoCampo>
                                    <Rotulo>Status</Rotulo>
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <DropdownSelect
                                                value={field.value}
                                                onChange={(v) => field.onChange(v)}
                                                options={[
                                                    { label: 'Ativo', value: 'ativo' },
                                                    { label: 'Inativo', value: 'inativo' }
                                                ]}
                                                placeholder="Selecione o status"
                                            />
                                        )}
                                    />
                                </GrupoCampo>
                            </Linha>

                            <Linha>
                                <GrupoCampo style={{ minWidth: '100%' }}>
                                    <Rotulo>Observações (opcional)</Rotulo>
                                    <Controller
                                        control={control}
                                        name="observacoes"
                                        render={({ field }) => (
                                            <TextArea {...field} onChange={(e: any) => field.onChange(e.detail.value)} />
                                        )}
                                    />
                                </GrupoCampo>
                            </Linha>
                        </>
                    )}

                    <BarraAcoes>
                        {etapa > 1 && (
                            <BotaoEtapa type="button" $variacao="secundario" onClick={() => setEtapa((e) => (e - 1) as any)}>
                                <FiArrowLeft />
                                Voltar
                            </BotaoEtapa>
                        )}
                        {etapa < 3 && (
                            <BotaoEtapa type="button" $variacao="primario" onClick={avancarEtapa}>
                                Próximo
                                <FiArrowRight />
                            </BotaoEtapa>
                        )}
                        {etapa === 3 && (
                            <BotaoEtapa type="submit" $variacao="primario">
                                <FiSave />
                                {editando ? 'Salvar alterações' : 'Salvar aluno'}
                            </BotaoEtapa>
                        )}
                    </BarraAcoes>
                </form>
            </Card>
        </ContainerPagina>
    )
}
