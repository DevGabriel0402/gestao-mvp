import { z } from 'zod'
import { calcularIdadePorDataISO, ehMenorDeIdade } from './datas'

export const esquemaAluno = z
    .object({
        nomeCompleto: z.string().min(3, 'Informe o nome completo'),
        dataNascimento: z.string().min(10, 'Informe a data de nascimento'),

        contatos: z.object({
            telefoneAlunoWhatsApp: z.string().min(10, 'Informe o WhatsApp do aluno'),
            telefonePaiWhatsApp: z.string().optional(),
            email: z.union([z.string().email('E-mail inválido'), z.literal('')]).optional()
        }),

        endereco: z.object({
            naoSabeCEP: z.boolean(),
            cep: z.string().optional(),
            logradouro: z.string(),
            numero: z.string(),
            complemento: z.string().optional(),
            bairro: z.string(),
            cidade: z.string(),
            uf: z.string().length(2)
        }),

        responsavel: z
            .object({
                nomeCompleto: z.string().optional(),
                parentesco: z.enum(['Pai', 'Mãe', 'Tutor', 'Outro']).optional(),
                telefoneWhatsApp: z.string().optional()
            })
            .optional(),

        oficina: z.string().min(1, 'Selecione a oficina'),
        nivel: z.string().min(1, 'Selecione o nível'),
        status: z.enum(['ativo', 'inativo']),
        observacoes: z.string().optional()
    })
    .superRefine((val, ctx) => {
        const idade = calcularIdadePorDataISO(val.dataNascimento)
        const menor = ehMenorDeIdade(idade)

        if (menor) {
            if (!val.responsavel?.nomeCompleto) {
                ctx.addIssue({
                    path: ['responsavel', 'nomeCompleto'],
                    message: 'Responsável é obrigatório para menor de idade',
                    code: z.ZodIssueCode.custom
                })
            }

            if (!val.responsavel?.telefoneWhatsApp) {
                ctx.addIssue({
                    path: ['responsavel', 'telefoneWhatsApp'],
                    message: 'WhatsApp do responsável é obrigatório',
                    code: z.ZodIssueCode.custom
                })
            }
        }
    })

export type ValoresAlunoFormulario = z.infer<typeof esquemaAluno>
